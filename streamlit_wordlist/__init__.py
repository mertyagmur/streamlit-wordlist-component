import streamlit.components.v1 as components


# Create a function _component_func which will call the frontend component when run
_component_func = components.declare_component(
    "wordlist",
    url="http://localhost:3001",  # Fetch frontend component from local webserver
)

def st_wordlist(items, key=None):
    component_value = _component_func(items=items, key=key)
    return component_value