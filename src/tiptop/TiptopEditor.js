import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
// => Tiptap packages
import { useEditor, EditorContent, ReactRenderer } from "@tiptap/react";
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
import "./styles.css";
// Custom
// import content from "./content";
import Select from "react-select";
import { MentionList, MentionList2 } from "./MentionList";
import { PluginKey } from "prosemirror-state";
const content = ``;
// Define your options for the Select box

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
export function SimpleEditor() {
	const [viewData, setViewData] = useState(content);
	const editor = useEditor({
		extensions: [
			Document,
			History,
			Paragraph,
			Text,
			Link.configure({
				openOnClick: false,
			}),
			Bold,
			Underline,
			Italic,
			Strike,
			Code,
			ListItem,
			// TextStyle,
			// StarterKit,
			BulletList,

			Mention.extend({
				name: "customMentionOne",
			}).configure({
				HTMLAttributes: {
					class: "mentionNode",
				},
				suggestion: {
					char: "@",
					pluginKey: new PluginKey("atKey"),
					render: () => {
						let reactRenderer;

						return {
							onStart: (props) => {
								reactRenderer = new ReactRenderer(MentionList, {
									props,
									editor: props.editor,
								});
							},

							onUpdate(props) {
								reactRenderer?.updateProps(props);
							},

							onKeyDown(props) {
								if (props.event.key === "Escape") {
									reactRenderer?.destroy();
									return true;
								}

								return reactRenderer?.ref?.onKeyDown(props);
							},

							onExit() {
								reactRenderer.destroy();
							},
						};
					},
				},
			}),
			Mention.extend({
				name: "customMentionTwo",
			}).configure({
				HTMLAttributes: {
					class: "mentionNode",
				},
				suggestion: {
					char: "#",
					pluginKey: new PluginKey("hashKey"),
					render: () => {
						let reactRenderer;

						return {
							onStart: (props) => {
								reactRenderer = new ReactRenderer(MentionList2, {
									props,
									editor: props.editor,
								});
							},

							onUpdate(props) {
								reactRenderer?.updateProps(props);
							},

							onKeyDown(props) {
								if (props.event.key === "Escape") {
									reactRenderer?.destroy();
									return true;
								}

								return reactRenderer?.ref?.onKeyDown(props);
							},

							onExit() {
								reactRenderer.destroy();
							},
						};
					},
				},
			}),
		],
		content,
		onFocus: ({ editor }) => {
			handleFocus(editor);
		},
		// onBlur: ({ editor }) => {
		// 	handleBlur(editor);
		// },
		onUpdate: ({ editor }) => {
			const content = editor.getHTML();
			console.log(content);
			setViewData(content);
		},
	});
	// const [url, setUrl] = useState("");

	const [selectedOption, setSelectedOption] = useState(null);

	// useEffect(() => {
	// 	const editorElement = document.querySelector(".ProseMirror");

	// 	if (editorElement) {
	// 		editorElement.addEventListener("focus", handleFocus);
	// 		editorElement.addEventListener("blur", handleBlur);

	// 		return () => {
	// 			editorElement.removeEventListener("focus", handleFocus);
	// 			editorElement.removeEventListener("blur", handleBlur);
	// 		};
	// 	}
	// }, [editor]);

	const toggleBold = useCallback(() => {
		editor.chain().focus().toggleBold().run();
	}, [editor]);

	const toggleUnderline = useCallback(() => {
		editor.chain().focus().toggleUnderline().run();
	}, [editor]);

	const toggleItalic = useCallback(() => {
		editor.chain().focus().toggleItalic().run();
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

	if (!editor) {
		return null;
	}

	return (
		<div className="editor">
			<div className="menu">
				<button className="menu-button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
					undo
				</button>
				<button className="menu-button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
					redo
				</button>

				<button
					className={classNames("menu-button", {
						"is-active": editor.isActive("bold"),
					})}
					onClick={toggleBold}
				>
					B
				</button>
				<button
					className={classNames("menu-button", {
						"is-active": editor.isActive("underline"),
					})}
					onClick={toggleUnderline}
				>
					U
				</button>
				<button
					className={classNames("menu-button", {
						"is-active": editor.isActive("italic"),
					})}
					onClick={toggleItalic}
				>
					I
				</button>
				<button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""}>
					bullet list
				</button>
				<button
					onClick={() => {
						handleBlur(editor);
					}}
				>
					Preview
				</button>
				<Select
					value={selectedOption}
					onChange={(option) => {
						handleSelectChange(option);
					}}
					options={options}
				/>
			</div>

			<EditorContent editor={editor} />

			{/* <h3>Editor Content</h3>
			<div dangerouslySetInnerHTML={{ __html: viewData }} /> */}
		</div>
	);
}
