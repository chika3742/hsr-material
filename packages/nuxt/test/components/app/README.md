# App Component Tests

This directory contains tests for the app components in the `components/app/` directory.

## Testing Approach

The tests focus on **type safety, interface validation, and business logic** rather than complex component mounting with mocked dependencies. This approach provides several benefits:

1. **Reliability**: Tests don't depend on complex mocking setups that can become brittle
2. **TypeScript Integration**: Tests validate TypeScript interfaces and type definitions
3. **Business Logic**: Tests validate the core logic and data structures
4. **Maintainability**: Tests are easier to maintain and understand

## Test Files

### AppDrawer.test.ts
Tests for the `AppDrawer.vue` component covering:
- **DrawerItem Type Validation**: Required and optional properties
- **Component Props Interface**: modelValue and drawerItems props
- **Component Events Interface**: update:modelValue emit
- **Data Variations**: Navigation items, external links, action items
- **Edge Cases**: Special characters, long strings, divider-only arrays
- **Type Safety**: Icon formats, URL validation, path validation

**20 test cases** covering all aspects of the component interface.

### AppFooter.test.ts
Tests for the `AppFooter.vue` component covering:
- **ThemeSetting Type Validation**: Valid theme values (light, dark, auto)
- **Component Props Interface**: All required props and their types
- **Component Events Interface**: update:themeSetting emit
- **Data Validation**: Version strings, URL formats, special characters
- **Business Logic**: Feedback URL construction, locale structure, menu items
- **Edge Cases**: Empty values, long strings, client-side environment

**14 test cases** covering all aspects of the component interface.

## Component Interfaces Tested

### AppDrawer
```typescript
interface Props {
  modelValue: boolean
  drawerItems: DrawerItemOrDivider[]
}

interface Emits {
  (e: "update:modelValue", value: boolean): void
}

interface DrawerItem {
  icon: string
  title: string
  to?: string
  href?: string
  target?: string
  onClick?: () => void
}

type DrawerItemOrDivider = DrawerItem | "---"
```

### AppFooter
```typescript
interface Props {
  currentVersion: string
  themeSetting: ThemeSetting
  repositoryUrl: string
  feedbackPageUrl: string
  hoyolabArticleUrl: string
}

interface Emits {
  (e: "update:themeSetting", value: ThemeSetting): void
}

type ThemeSetting = "light" | "dark" | "auto"
```

## Running Tests

```bash
# Run app component tests only
npx vitest run test/components/app

# Run all tests
npx vitest run
```

## Benefits of This Approach

1. **No Dependency Mocking**: Avoids complex setup for Vuetify, i18n, and other dependencies
2. **Fast Execution**: Tests run quickly without component mounting overhead
3. **Type Safety**: Validates TypeScript interfaces at runtime
4. **Business Logic Focus**: Tests the actual logic that matters for the application
5. **Maintainable**: Easy to update when component interfaces change
6. **Comprehensive**: Covers edge cases and data validation thoroughly