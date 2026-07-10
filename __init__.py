import os

# Define the local assets path matching our self-contained structure
NODE_DIR = os.path.dirname(os.path.abspath(__file__))
LISTS_DIR = os.path.join(NODE_DIR, "lists")

class ComfyUIDynamicDropdownsPlaceholder:
    @classmethod
    def INPUT_TYPES(cls):
        # Fallback values if the user hasn't populated their text files yet
        styles = ["Amateur Candid", "Studio Cinematic", "Vintage Film"]
        lighting = ["Soft Natural", "Harsh Neon", "Golden Hour"]

        # Dynamically load from files if they exist
        style_path = os.path.join(LISTS_DIR, "demo_style.txt")
        if os.path.exists(style_path):
            with open(style_path, "r", encoding="utf-8") as f:
                styles = [line.strip() for line in f if line.strip()]

        lighting_path = os.path.join(LISTS_DIR, "demo_lighting.txt")
        if os.path.exists(lighting_path):
            with open(lighting_path, "r", encoding="utf-8") as f:
                lighting = [line.strip() for line in f if line.strip()]

        return {
            "required": {
                "clip": ("CLIP",),
                "demo_style": (styles,),
                "demo_lighting": (lighting,),
            }
        }

    RETURN_TYPES = ("STRING", "CONDITIONING")
    RETURN_NAMES = ("PROMPT_STRING", "CONDITIONING")
    FUNCTION = "process_prompt"
    CATEGORY = "Custom Selection"

    def process_prompt(self, clip, demo_style, demo_lighting):
        # Concatenate the dropdown choices into a raw comma-separated string
        clean_choices = [str(demo_style).strip(), str(demo_lighting).strip()]
        final_prompt = ", ".join([c for c in clean_choices if c])

        # Core execution logic tokenizing the text directly into CLIP conditioning data
        tokens = clip.tokenize(final_prompt)
        cond, pooled = clip.encode_from_tokens(tokens, return_pooled=True)
        conditioning_output = [[cond, {"pooled_output": pooled}]]

        return (final_prompt, conditioning_output)

NODE_CLASS_MAPPINGS = {
    "ComfyUI_Dynamic_Dropdowns_Demo": ComfyUIDynamicDropdownsPlaceholder
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ComfyUI_Dynamic_Dropdowns_Demo": "🎭 Dynamic Dropdowns (Demo Mode)"
}