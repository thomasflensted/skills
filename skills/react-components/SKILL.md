---
name: react-components
description: Guide for writing React components. Use when the user asks to create, build, or modify a React component.
version: 0.1.0
---

# React components

Guide for writing React components.

## Rules

### One component per file

Every component lives in its own file. No exceptions.

### Props type above the component

Define a `type Props = { ... }` above the component. Never inline props.

```tsx
type Props = {
  title: string;
  onPress: () => void;
};

const MyComponent = ({ title, onPress }: Props) => {
  // ...
};
```

### Early returns over inline ternaries

Prefer early returns to handle conditional rendering, even if it means duplicating some JSX. This keeps each branch flat and readable.

```tsx
// Good — each branch is its own return
const EventCard = ({ event, isCompact }: Props) => {
  if (isCompact) {
    return (
      <View className="flex-row">
        <Text>{event.title}</Text>
      </View>
    );
  }

  return (
    <View className="flex gap-4">
      <Text className="text-lg">{event.title}</Text>
      <Text>{event.description}</Text>
    </View>
  );
};
```

### Separate data fetching and rendering

For components that depend on external data, split into a wrapper that fetches and a pure component that renders. The wrapper handles loading, error, and success states with early returns. Skip this for small, simple components where the split adds more noise than clarity.

If the screen has a shared layout (e.g. a header) that doesn't depend on fetched data, render it in the wrapper so loading and error states still show it. Duplicate the shared layout in each early return rather than inlining ternaries.

```tsx
// EventScreen.tsx — fetches data, handles loading/error
const EventScreen = () => {
  const { data, status, refetch } = useEvent(eventId);

  if (status === "pending") {
    return (
      <Layout>
        <Header title="Event" />
        <EventSkeleton />
      </Layout>
    );
  }

  if (status === "error") {
    return (
      <Layout>
        <Header title="Event" />
        <ErrorView refetch={refetch} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Event" />
      <EventContent event={data.event} />
    </Layout>
  );
};
```

When there is no shared layout, keep the early returns concise:

```tsx
const EventScreen = () => {
  const { data, status, refetch } = useEvent(eventId);

  if (status === "pending") return <EventSkeleton />;
  if (status === "error") return <ErrorView refetch={refetch} />;

  return <EventContent event={data.event} />;
};
```

### Always handle loading and error states

Every component that depends on external data must handle both loading and error. Use `status` from the query hook — never destructure `isPending`, `isError`, `isSuccess` separately.

### Always use loading skeletons

Show a skeleton that mirrors the layout while data is loading. Animate placeholder shapes to indicate content is on the way.

### Split large components

When a component grows beyond what fits comfortably on one screen, extract logical sections into their own components. Each gets its own file.

### Never use useEffect

Never use `useEffect`. If you feel the need, explore other options first — see [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

### Don't use unnecessary optional chaining

After early returns for `"pending"` and `"error"`, `data` is guaranteed to be defined. Access it directly — don't use `data?.field`.

### Don't alias unless necessary

Use props and destructured values directly. Don't rename them to local variables unless there's a genuine naming conflict.

### Never extract JSX into intermediate variables

Don't assign JSX to variables like `const avatar = <Avatar />`. If two branches need the same element, write it out in full in each branch.

### Use the design system

Before building any new UI element, check the existing component library for something that already handles it. Use established color tokens — never hardcode hex values or reach for generic palette colors.
