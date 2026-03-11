# Content Tabs Tests

## Basic Tabs

=== "Python"
    ```python
    def greet(name):
        print(f"Hello, {name}!")
    ```

=== "JavaScript"
    ```javascript
    function greet(name) {
        console.log(`Hello, ${name}!`);
    }
    ```

=== "Rust"
    ```rust
    fn greet(name: &str) {
        println!("Hello, {}!", name);
    }
    ```

## Tabs with Mixed Content

=== "Installation"
    Install the package using pip:

    ```bash
    pip install mkdocs-material
    ```

    Then verify:

    ```bash
    mkdocs --version
    ```

=== "Configuration"
    Add to your `mkdocs.yml`:

    ```yaml
    theme:
      name: material
    ```

=== "Usage"
    Run the dev server:

    ```bash
    mkdocs serve
    ```

    Then open `http://localhost:8000` in your browser.
