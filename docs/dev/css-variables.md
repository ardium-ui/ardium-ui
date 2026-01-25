# CSS Variables in theme files

Ardium UI implements basic customization via native CSS variables.

The default values are set in `:root` selectors for every component separately, and globally in `core.scss`.

## Why some variables are commented out

Some variables are commented out because they should inherit their value from another variable (usually a global variable).

It is implemented this way because no other solution works.

They cannot be defined so that their default value is another variable, such as:

```css
:root {
  --ard-input-height: var(--ard-form-field-height, 2.3125rem);
}
```

Implementing it in this way causes the final value to be resolved at `:root` level, and if `--ard-form-field-height` is changed further down the DOM tree, the new value is ignored and the root-level value is used.

The variables also cannot be defined with an empty value, such as:

```css
:root {
  --ard-input-height: ;
}
```

Implementing it in this way causes the variable to be treated as empty value, and the property that uses the variable thus also becomes empty, ignoring all fallbacks.

The variables also cannot be just given a default value the same as the global value, because then they wouldn't inherit from the global variable.

And thus, commenting them out (or removing their definitions entirely) is the only way to solve those issues. They are commeted out instead of removed to inform that the variable exists, but its default value is inherited from another variable.
