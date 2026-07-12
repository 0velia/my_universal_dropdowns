class DynamicDropdownDemoNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "style": (["Studio Cinematic", "Anime Flat", "Editorial", "Raw Documentary", "Soft Portrait"],),
                "lighting": (["Soft Natural", "Harsh Neon", "Golden Hour", "Blue Hour", "Studio Key"],),
                "post_process": (["Orange Down", "Teal & Orange", "Matte Black", "Film Grain", "Clean"],),
                "camera": (["Studio Cinematic, Tyren Style", "35mm f/1.4", "Anamorphic", "Wide Angle", "Macro"],),
                "composition": (["Studio Cinematic", "Rule of Thirds", "Centered", "Dutch Angle", "Overhead"],),
            },
            "optional": {
                "input_string": ("STRING", {"forceInput": True}),
                "clip": ("CLIP",),
            }
        }

    RETURN_TYPES = ("STRING", "CONDITIONING")
    RETURN_NAMES = ("PROMPT_STRING", "CONDITIONING")
    FUNCTION = "execute"
    CATEGORY = "🎭 Dynamic Dropdowns"

    def execute(self, clip=None, input_string="", **kwargs):
        selections = []
        
        # Pull standard selections from the demo dropdowns block sequence
        for key in ["style", "lighting", "post_process", "camera", "composition"]:
            if key in kwargs:
                val = str(kwargs[key]).strip()
                if val and val != "None":
                    selections.append(val)
                    
        # Inject upstream daisy-chained string blocks if present
        if input_string and input_string.strip():
            selections.insert(0, input_string.strip())
            
        final_string = ", ".join(selections)
        final_string = final_string.replace('"', '').replace('\\\\', '').replace(', ,', ',')
        
        # Process Conditioning Block engine stack mapping
        conditioning = []
        if clip is not None:
            tokens = clip.tokenize(final_string)
            cond, pooled = clip.encode_from_tokens(tokens, return_pooled=True)
            conditioning = [[cond, {"pooled_output": pooled}]]
            
        return (final_string, conditioning)

NODE_CLASS_MAPPINGS = {
    "DynamicDropdownDemoNode": DynamicDropdownDemoNode
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "DynamicDropdownDemoNode": "🎭 Dynamic Dropdowns (Demo Mode)"
}