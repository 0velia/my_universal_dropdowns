import os

NODE_DIR = os.path.dirname(os.path.abspath(__file__))
LISTS_DIR = os.path.join(NODE_DIR, "lists")

class ComfyUIDynamicDropdownsPlaceholder:
    @classmethod
    def INPUT_TYPES(cls):
        styles = ["Amateur Candid", "Studio Cinematic", "Vintage Film"]
        lighting = ["Soft Natural", "Harsh Neon", "Golden Hour"]

        return {
            "required": {
                "demo_style": (styles,),
                "demo_lighting": (lighting,),
            },
            # Moving both CLIP and the daisy-chain string input to the optional block
            "optional": {
                "input_string": ("STRING", {"forceInput": True}),
                "clip": ("CLIP",),
            }
        }

    RETURN_TYPES = ("STRING", "CONDITIONING")
    RETURN_NAMES = ("PROMPT_STRING", "CONDITIONING")
    FUNCTION = "process_prompt"
    CATEGORY = "Custom Selection"

    def process_prompt(self, demo_style, demo_lighting, input_string="", clip=None):
        # 1. Initialize our array of prompt segments
        clean_choices = []
        
        # 2. If a previous node is connected, inject its text first
        if input_string and str(input_string).strip():
            clean_choices.append(str(input_string).strip())
            
        # 3. Append the current dropdown choices
        if demo_style:
            clean_choices.append(str(demo_style).strip())
        if demo_lighting:
            clean_choices.append(str(demo_lighting).strip())

        # 4. Join everything with a clean single comma, filtering out empty entries
        final_prompt = ", ".join([c for c in clean_choices if c])

        # 5. Handle the optional CLIP conditioning encoding
        if clip is not None:
            tokens = clip.tokenize(final_prompt)
            cond, pooled = clip.encode_from_tokens(tokens, return_pooled=True)
            conditioning_output = [[cond, {"pooled_output": pooled}]]
        else:
            conditioning_output = None

        return (final_prompt, conditioning_output)

NODE_CLASS_MAPPINGS = {
    "ComfyUI_Dynamic_Dropdowns_Demo": ComfyUIDynamicDropdownsPlaceholder
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ComfyUI_Dynamic_Dropdowns_Demo": "🎭 Dynamic Dropdowns (Demo Mode)"
}
