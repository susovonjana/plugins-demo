import React, {useCallback, useEffect, useState} from "react";


import {useEditor, EditorContent, ReactRenderer, useCurrentEditor} from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Mention from "@tiptap/extension-mention";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import {MentionList, MentionList2} from "../tiptop/MentionList";
import classNames from "classnames";
import Select from "react-select";
import "../tiptop/styles.css";
import {TextAlign} from "@tiptap/extension-text-align";
import {
    BoldIcon,
    EyeIcon,
    EyeOffIcon,
    ItalicIcon,
    ListIcon, ListOrderedIcon,
    RedoIcon,
    StrikethroughIcon,
    UnderlineIcon,
    UndoIcon
} from "lucide-react";
import {OrderedList} from "@tiptap/extension-ordered-list";




const options = [
    { value: "organization_logo", label: "Logo" },
    { value: "organization_name", label: "Name" },
    { value: "user_name", label: "Susovon" },
    { value: "transaction_number", label: "Payment Number" },
    { value: "amount", label: "Amount" },
    { value: "issue_date", label: "Issue Date" },
];
const place_holder_data = {
    "{{user_name}}": "Susovon",
    "{{organization_logo}}": "Org Logo",
    "{{organization_name}}": "Org Name",
    "{{transaction_number}}": "Payment Number",
    "{{amount}}": "Amount",
    "{{issue_date}}": "Issue Date",
    "#current_year": "2024",
    "#client_type": "Client Type",
    "#period": "Period",
    "#prior_year": "2023",
};


const FinalEditor = React.forwardRef(({onChange, onFocus,  MenuBar,content,...props}, ref) => {
    const editor = useEditor({
        extensions:[
            StarterKit,
            Document,
            Paragraph,
            Text,
            Link.configure({
                openOnClick: false,
            }),
            Underline,
            Code,
            ListItem,
            BulletList,
            OrderedList,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'right',
            })],
        content,
    });

    if(!editor){
        return null;
    }
    else{
        editor.on("update", ({ editor }) => {
            onChange?.(editor.getHTML());
        });
    }





    return(
        <div className="editor">
            <MenuBar editor={editor} {...props} />
            <EditorContent editor={editor} />
        </div>
    )
})



const MenuBar = ({editor,...props}) => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [isPreview, setIsPreview]= useState(false);

    const toggleBold = useCallback(() => {
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleUnderline = useCallback(() => {
        editor.chain().focus().toggleUnderline().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const toggleStrike = useCallback(() => {
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    const handleSelectChange = (option) => {
        setSelectedOption(option);
        const tag = option.value;
        const tagVal = ` {{${tag}}} `;
        editor
            .chain()
            .focus()
            .command(({ tr, commands }) => {
                commands.insertContent({ type: "text", text: tagVal });
                return true;
            })
            .run();
    };

    const handleFocus = (editor) => {
        // console.log("focus");
        let contentWithPlaceholders = editor.getHTML();
        Object.keys(place_holder_data).forEach((tag) => {
            const value = place_holder_data[tag];
            const regex = new RegExp(value, "g");
            contentWithPlaceholders = contentWithPlaceholders.replace(regex, tag);
        });
        // console.log(contentWithPlaceholders);
        editor.commands.setContent(contentWithPlaceholders);
    };

    const handleBlur = (editor) => {
        let contentWithValues = editor.getHTML();
        Object.keys(place_holder_data).forEach((tag) => {
            const regex = new RegExp(tag, "g");
            contentWithValues = contentWithValues.replace(regex, place_holder_data[tag]);
        });
        editor.commands.setContent(contentWithValues);
    };

    const togglePreview = (editor) => {
        if(!isPreview){
            handleBlur(editor);
        }
        else{
           handleFocus(editor);
        }
        setIsPreview(!isPreview);
    }

    const toggleBulletList = useCallback(() => {
        editor.chain().focus().toggleBulletList().run()
    },[editor])

    const toggleOrderedList = useCallback(() => {
        editor.chain().focus().toggleOrderedList().run()
    },[editor])

    //
    if(editor){
        // note: only focus event is good in here.
        // editor.on("focus", ()=> {handleFocus(editor)});
    }

    const icon_props = {
        size : 18,
    }

    return (
        <div className="menu">
            <button className="menu-button" onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}>
                <UndoIcon {...icon_props}/>
            </button>
            <button className="menu-button" onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}>
                <RedoIcon {...icon_props}/>
            </button>

            <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("bold"),
                })}
                onClick={toggleBold}
            >
                <BoldIcon {...icon_props} />
            </button>
            <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("underline"),
                })}
                onClick={toggleUnderline}
            >
                <UnderlineIcon {...icon_props}/>
            </button>
            <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("italic"),
                })}
                onClick={toggleItalic}
            >
                <ItalicIcon {...icon_props}/>
            </button>

            <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("strike"),
                })}
                onClick={toggleStrike}
            >
                <StrikethroughIcon {...icon_props}/>
            </button>
            <button onClick={toggleBulletList}
                    className={classNames("menu-button", {"is-active" :editor.isActive("bulletList")})}>
                <ListIcon/>
            </button>
            <button onClick={toggleOrderedList}
                    className={classNames("menu-button", {"is-active" :editor.isActive("orderedList")})}>
                <ListOrderedIcon/>
            </button>
            <button
                onClick={() => {
                    togglePreview(editor);
                }}
                className={
                classNames(
                "menu-button",
                    isPreview && "is-active")
                }
            >
               <EyeIcon {...icon_props}/>
            </button>
            <Select
                value={selectedOption}
                onChange={(option) => {
                    handleSelectChange(option);
                }}
                options={options}
            />
        </div>
    )

}
export {
    FinalEditor,
    MenuBar
}