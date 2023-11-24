import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    Streamlit,
    withStreamlitConnection,
    ComponentProps
  } from "streamlit-component-lib";


interface WordItem {
    word: string;
    start: number;
    end: number;
    score: number;
    emphasize?: boolean;
    }

interface WordListProps {
    items: WordItem[];
    }

const WordList = (props: ComponentProps) => {

    const {items}: WordListProps = props.args;

    const [wordList, setWordList] = useState<WordItem[]>(items);
    const [editableIndex, setEditableIndex] = useState<number | null>(null);
    const [undoHistory, setUndoHistory] = useState<WordItem[][]>([]);
    const [originalList, setOriginalList] = useState<WordItem[]>(items);

    useEffect(() => {
      setOriginalList(items);
    }, [items]);
  
    useEffect(() => {
      setUndoHistory((prevHistory) => [...prevHistory, wordList]);
    }, [wordList]);

    useEffect(() => Streamlit.setFrameHeight());

    const handleCheck = (index: number) => {
        setWordList((prevList) => {
            const newList = [...prevList];
            newList[index] = { ...newList[index], emphasize: !newList[index].emphasize };
            Streamlit.setComponentValue(newList)
            return newList;
        });
    };

    const handleMerge = (index: number) => {
        if (index < wordList.length - 1) {
          setWordList((prevList) => {
            const newList = [...prevList];
            const mergedItem: WordItem = {
              word: `${newList[index].word} ${newList[index + 1].word}`,
              start: newList[index].start,
              end: newList[index + 1].end,
              score: (newList[index].score + newList[index + 1].score) / 2,
            };
            newList.splice(index, 2, mergedItem);
            Streamlit.setComponentValue(newList)
            return newList;
          });
        }
      };

    const handleDoubleClick = (index: number) => {
    setEditableIndex(index);
    };

    const handleTextChange = (index: number, newText: string) => {
    setWordList((prevList) => {
        const newList = [...prevList];
        newList[index] = { ...newList[index], word: newText };
        Streamlit.setComponentValue(newList)
        return newList;
    });
    };

    const handleBlur = () => {
      setEditableIndex(null);
    };

    const handleUndo = () => {
      setWordList((prevList) => {
        const newList = [...prevList];
        const previousState = undoHistory.pop();
        if (previousState) {
          setUndoHistory([...undoHistory]);
          Streamlit.setComponentValue(previousState);
          return previousState;
        }
        return newList;
      });
    };
  
    const handleReset = () => {
      setWordList(originalList);
      Streamlit.setComponentValue(originalList);
      setUndoHistory([]);
    };
    
    return (
        <div style={{ maxHeight: "600px", width: "400px", overflowY: "scroll" }}
        >
          {wordList.map((item, index) => (
            <div key={index} style={
                { display: 'flex', 
                border: "1px solid gray", 
                borderRadius: "8px", 
                alignItems: 'center', 
                justifyContent: "space-between", 
                margin: '5px',
                }
              }>
                <div style={{ display: 'flex'}}>
                    <p>❗</p>
                    <input
                    type="checkbox"
                    checked={item.emphasize || false}
                    onChange={() => handleCheck(index)}
                    />
                </div>
                {editableIndex === index ? (
                <input
                  type="text"
                  value={item.word}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleTextChange(index, e.target.value)
                  }
                  onBlur={handleBlur}
                />
              ) : (
                <div
                  style={{
                    margin: '0 10px',
                    border: '1px solid gray',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'text',
                    color: item.emphasize ? 'lightgreen' : 'white',
                    backgroundColor: "#1a1a1a"
                  }}
                  onDoubleClick={() => handleDoubleClick(index)}
                >
                  {item.word}
                </div>
              )}
              <button onClick={() => handleMerge(index)} disabled={index === wordList.length - 1}>
              ⏬
              </button>
            </div>
          ))}
          <div style={{ marginTop: '10px', display: "flex", gap: "30px", justifyContent: "center" }}>
            <button onClick={handleUndo} disabled={undoHistory.length === 0}>
              Undo
            </button>
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>
      );

}

export default withStreamlitConnection(WordList);