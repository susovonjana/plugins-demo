import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolBar";
import "react-quill/dist/quill.snow.css";
import "./quillCss.css";
import QuillMention from "quill-mention";
import { Mention, MentionBlot } from "quill-mention";

export const Editor = () => {
	const preloadedDoc = `HI`;
	const quillRef = useRef();
	const [state, setState] = useState({ value: preloadedDoc });
	const handleChange = (value) => {
		setState({ value });
		console.log({ value });
	};

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

	const handleSelectChange = (option) => {
		const tag = option.value;
		const tagVal = ` {{${tag}}} `;
		const quill = quillRef.current.getEditor();
		quill.focus(); // Ensure the editor is focused before getting the selection
		const selection = quill.getSelection(true); // Pass true to focus the editor if it's not focused
		const cursorPosition = selection ? selection.index : 0;
		quill.insertText(cursorPosition, tagVal);
		quill.setSelection(cursorPosition + tagVal.length);
	};

	const replaceTagsWithValues = () => {
		let content = quillRef.current.getEditor().root.innerHTML;
		Object.keys(place_holder_data).forEach((tag) => {
			const regex = new RegExp(tag, "g");
			content = content.replace(regex, place_holder_data[tag]);
		});
		setState({ value: content });
	};

	const replaceValuesWithTags = () => {
		let content = quillRef.current.getEditor().root.innerHTML;
		Object.keys(place_holder_data).forEach((tag) => {
			const value = place_holder_data[tag];
			const regex = new RegExp(value, "g");
			content = content.replace(regex, tag);
		});
		setState({ value: content });
	};

	return (
		<div className="text-editor">
			<EditorToolbar onSelectChange={handleSelectChange} />
			<ReactQuill
				ref={quillRef}
				theme="snow"
				value={state.value}
				modules={modules}
				formats={formats}
				onChange={handleChange}
				onBlur={replaceTagsWithValues}
				onFocus={replaceValuesWithTags}
			/>
		</div>
	);
};

export default Editor;
