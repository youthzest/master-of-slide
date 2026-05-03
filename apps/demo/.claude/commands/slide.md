Create a Master Of Slide deck from a Markdown or Obsidian note.

Usage:

```text
/slide /absolute/path/to/source.md
```

Instructions:

- Use the `slide` skill.
- Treat `$ARGUMENTS` as the Markdown path plus any optional user constraints.
- Before writing files, ask for missing values:
  - slide page count
  - generated image count
- Read the source note, but do not modify it.
- Create the deck under `slides/<kebab-case-id>/index.tsx`.
- Copy referenced local assets into `slides/<id>/assets/` when possible.
- If image generation is available, use `create-slide-image-prompts` to create the requested number of image assets.
- If image generation is unavailable, leave the requested number of precise `ImagePlaceholder` hints and report the prompts.
- Follow `slide-authoring` before writing React.

User arguments:

```text
$ARGUMENTS
```
