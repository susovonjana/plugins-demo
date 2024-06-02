import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-mention";
import { Mention, MentionBlot } from "quill-mention";
import "./quillCss.css";
// Import mention module directly
// Register Mention module with Quill
Quill.register("modules/mention", Mention);
Quill.register("formats/mention", MentionBlot);

const atValues = [
	{ id: 1, value: "Fredrik Sundqvist" },
	{ id: 2, value: "Patrik Sjölin" },
];

const hashValues = [
	{ id: 3, value: "Fredrik Sundqvist 2" },
	{ id: 4, value: "Patrik Sjölin 2" },
];

const Editor = () => {
	const quillRef = useRef(null);
	const [state, setState] = useState({ value: "HI" });

	const handleChange = (value) => {
		setState({ value });
		console.log({ value });
	};

	const modules = {
		toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"]],
		mention: {
			allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
			mentionDenotationChars: ["@", "#"],
			source: function (searchTerm, renderList, mentionChar) {
				let values;

				if (mentionChar === "@") {
					values = atValues;
				} else {
					values = hashValues;
				}

				if (searchTerm.length === 0) {
					renderList(values, searchTerm);
				} else {
					const matches = values.filter((value) => value.value.toLowerCase().includes(searchTerm.toLowerCase()));
					renderList(matches, searchTerm);
				}
			},
			onSelect: function (item, insertItem) {
				insertItem(item);
			},
			onOpen: function () {
				console.log("Mention menu opened");
			},
			onClose: function () {
				console.log("Mention menu closed");
			},
		},
	};

	const formats = ["header", "bold", "italic", "underline", "list", "bullet", "link", "image", "mention"];

	return (
		<div className="text-editor">
			<ReactQuill ref={quillRef} theme="snow" value={state.value} modules={modules} formats={formats} onChange={handleChange} />
		</div>
	);
};

export default Editor;
