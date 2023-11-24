import streamlit as st
from streamlit_wordlist import st_wordlist

items = [
  { 'word': 'a', 'start': 0.328, 'end': 0.728, 'score': 0.888 },
  { 'word': 'b', 'start': 0.809, 'end': 0.889, 'score': 0.762 },
  { 'word': 'c', 'start': 0.909, 'end': 1.069, 'score': 0.999 },
  { 'word': 'd', 'start': 1.109, 'end': 1.389, 'score': 0.906 },
  { 'word': 'e', 'start': 1.429, 'end': 1.749, 'score': 0.946 },
  { 'word': 'f', 'start': 1.769, 'end': 2.089, 'score': 0.925 },
  { 'word': 'g', 'start': 2.109, 'end': 2.35, 'score': 0.994 },
  { 'word': 'h,', 'start': 2.37, 'end': 2.71, 'score': 0.998 }
]

wordlist = st_wordlist(items)

wordlist