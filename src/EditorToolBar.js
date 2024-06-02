import React from "react";
import {
	FaRedo,
	FaUndo,
	FaRegWindowMinimize,
	// FaRegSquare,
	// FaStar,
} from "react-icons/fa";
import { Quill } from "react-quill";
// import Dropdown from "./Dropdown";
import "./quillCss.css";
import Select from "react-select";

const UndoButton = () => <FaUndo />;
const RedoButton = () => <FaRedo />;
const DividerButton = () => <FaRegWindowMinimize />;

function undoChange() {
	this.quill.history.undo();
}
function redoChange() {
	this.quill.history.redo();
}

const BlockEmbed = Quill.import("blots/block/embed");
class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = "divider";
DividerBlot.tagName = "hr";
Quill.register(DividerBlot);

function addDivider() {
	const range = this.quill.getSelection(true);
	this.quill.insertText(range.index, "\n", Quill.sources.USER);
	this.quill.insertEmbed(range.index + 1, "divider", true, Quill.sources.USER);
	this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
}

const Inline = Quill.import("blots/inline");
class EmphBlot extends Inline {}
EmphBlot.blotName = "em";
EmphBlot.tagName = "em";
EmphBlot.className = "custom-em";
Quill.register("formats/em", EmphBlot);

function addBorder() {
	const range = this.quill.getSelection();
	if (range) {
		this.quill.format("em", true);
	}
}

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = ["arial", "comic-sans", "courier-new", "georgia", "helvetica", "lucida"];
Quill.register(Font, true);
const atValues = [
	{ id: 1, value: "Fredrik Sundqvist" },
	{ id: 2, value: "Patrik Sjölin" },
];
const hashValues = [
	{ id: 3, value: "Fredrik Sundqvist 2" },
	{ id: 4, value: "Patrik Sjölin 2" },
];
export const modules = {
	toolbar: {
		container: "#toolbar",
		handlers: {
			undo: undoChange,
			redo: redoChange,
			divide: addDivider,
			border: addBorder,
		},
	},
	history: {
		delay: 500,
		maxStack: 100,
		userOnly: true,
	},
	// mention: {
	// 	allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
	// 	mentionDenotationChars: ["@", "#"],
	// 	source: function (searchTerm, renderList, mentionChar) {
	// 		let values;

	// 		if (mentionChar === "@") {
	// 			values = atValues;
	// 		} else {
	// 			values = hashValues;
	// 		}

	// 		if (searchTerm.length === 0) {
	// 			renderList(values, searchTerm);
	// 		} else {
	// 			const matches = [];
	// 			for (let i = 0; i < values.length; i++) if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
	// 			renderList(matches, searchTerm);
	// 		}
	// 	},
	// },
};

// Formats objects for setting up the Quill editor
export const formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"align",
	"strike",
	"script",
	"blockquote",
	"background",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"color",
	"code-block",
	"em",
	"p",
	"divider",
	"hr",
	"formats/em",
];

const selectOptions = [
	{ value: "organization_logo", label: "Logo" },
	{ value: "organization_name", label: "Name" },
	{ value: "user_name", label: "Susovon" },
	{ value: "transaction_number", label: "Payment Number" },
	{ value: "amount", label: "Amount" },
	{ value: "issue_date", label: "Issue Date" },
];

const CustomSelect = ({ onSelectChange }) => (
	<Select
		options={selectOptions}
		styles={{
			control: (styles) => ({
				...styles,
				width: "150px",
				height: "20px",
				margin: "0 10px",
				border: "1px solid #ccc",
				borderRadius: "4px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}),
			menu: (styles) => ({
				...styles,
				width: "150px", // Set this to your desired width
			}),
		}}
		defaultValue={selectOptions[0]}
		onChange={onSelectChange}
	/>
);

// Quill Toolbar component
export const QuillToolbar = ({ onSelectChange }) => (
	<div id="toolbar" style={{ width: "1086px" }}>
		{/* <span className="ql-formats">
			<select className="ql-header" defaultValue="6">
				<option value="1">Heading 1</option>
				<option value="2">Heading 2</option>
				<option value="3">Heading 3</option>
				<option value="4">Heading 4</option>
				<option value="5">Heading 5</option>
				<option value="6">Heading 6</option>
				<option value="">Normal</option>
			</select>
		</span>
		<span className="ql-formats">
			<select className="ql-align" />
			<select className="ql-background" />
		</span>
		<span className="ql-formats">
			<button className="ql-blockquote" />
			<button className="ql-code-block" />
			<button className="ql-star">
				<StartButton />
			</button>
		</span>
		<span className="ql-formats">
			<button className="ql-list" value="ordered" />
			<button className="ql-list" value="bullet" />
			<button className="ql-indent" value="-1" />
			<button className="ql-indent" value="+1" />
		</span>
		<span className="ql-formats">
			<button className="ql-link" />
			<button className="ql-image" />
		</span> */}
		<span className="ql-formats">
			<button className="ql-bold" />
			<button className="ql-italic" />
			<button className="ql-underline" />
			<button className="ql-strike" />
		</span>
		<span className="ql-formats">
			<button className="ql-divide">
				<DividerButton />
			</button>
			{/* <button className="ql-border">
        <BorderButton />
      </button> */}
		</span>
		<span className="ql-formats">
			<button className="ql-undo">
				<UndoButton />
			</button>
			<button className="ql-redo">
				<RedoButton />
			</button>
		</span>
		<CustomSelect onSelectChange={onSelectChange} />
	</div>
);

export default QuillToolbar;
