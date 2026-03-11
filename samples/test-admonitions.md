# Admonition Tests

## Standard Admonitions

!!! note "This is a note"

    hola que tal esto estabien
    Notes are useful for highlighting important information.

    They can contain **multiple paragraphs** and even `inline code`.

!!! warning
    This is a warning without a custom title. It should default to "Warning".

!!! danger "Danger Zone"
    Be very careful with this operation!

!!! tip "Pro Tip"
    Use keyboard shortcuts to speed up your workflow.

!!! info "Information"
    This is an informational admonition with some details.

    - List item one
    - List item two
    - List item three

!!! success "Task Complete"
    Everything worked as expected.

!!! failure "Build Failed"
    The build failed due to a missing dependency.

!!! bug "Known Issue"
    There is a known issue with the rendering of nested lists.

!!! example "Example Usage"
    ```python
    def hello():
        print("Hello, World!")
    ```

!!! quote "Famous Quote"
    "The only way to do great work is to love what you do." — Steve Jobs

## Collapsible Admonitions

??? note "Click to expand"
    This content is hidden by default.

    You need to click the title to see it.

???+ warning "Initially open collapsible"
    This collapsible admonition starts open.

    Users can collapse it by clicking the title.

## Nested Admonitions

!!! note "Outer Admonition"
    This is the outer admonition.

    !!! warning "Inner Admonition"
        This is nested inside the outer one.

        !!! danger "Deep Nesting"
            Three levels deep!

## All Types

!!! abstract "Abstract"
    Abstract content.

!!! question "FAQ"
    Frequently asked question.

!!! error "Error"
    Something went wrong.
