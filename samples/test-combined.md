# Combined Features Test

## Admonition with Tabs Inside

!!! example "Multi-language Example"
    Choose your language:

    === "Python"
        ```python
        print("Hello from Python!")
        ```

    === "JavaScript"
        ```javascript
        console.log("Hello from JS!");
        ```

## Admonition with Enhanced Code

!!! tip "Configuration Example"
    Create the following config file:

    ```yaml title="mkdocs.yml" hl_lines="3-4"
    theme:
      name: material
      palette:
        primary: indigo
    ```

## Collapsible with Content

??? info "Click for Details"
    This is a collapsible section with a list:

    1. First item
    2. Second item
    3. Third item

    And a code block:

    ```bash
    echo "Hello!"
    ```

## Regular Markdown Still Works

This is a regular paragraph with **bold**, *italic*, and `code`.

- Bullet list
- Works fine
- As expected

> Blockquotes work too.

| Column 1 | Column 2 |
|-----------|----------|
| Data      | More data|
