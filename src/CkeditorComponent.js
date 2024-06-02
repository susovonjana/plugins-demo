import React, { useEffect, useState } from "react";
import { CKEditor } from "ckeditor4-react";

const CkeditorComponent = () => {
	const [viewData, setData] = useState("");

	const handleEditorChange = (event) => {
		setData(event.editor.getData());
	};

	let tempPHIndv = {
		organization: {
			organization_logo: "Logo",
			organization_name: "Name",
			user_name: "Susovon",
		},
		payment: {
			transaction_number: "Payment Number",
			amount: "Amount",
			issue_date: "Issue Date",
		},
	};

	function addRichCombo(editor, comboName, label, title, initFunction) {
		editor.ui.addRichCombo(comboName, {
			label: label,
			title: title,
			toolbar: "basicstyles,0",
			panel: {
				css: [
					"https://cdn.ckeditor.com/4.16.2/standard-all/skins/moono-lisa/editor.css?t=L7C8",
					"https://cdn.ckeditor.com/4.4.0/standard/contents.css?t=E3OD",
					"./styles.css",
				],
				multiSelect: false,
				attributes: { "aria-label": "Insert Placeholder" },
			},
			init: initFunction,
			onClick: function (value) {
				editor.focus();
				editor.fire("saveSnapshot");
				editor.insertHtml(value);
				editor.fire("saveSnapshot");
			},
		});
	}

	return (
		<div>
			<h2>CKEditor 4 in React</h2>
			<CKEditor
				config={{
					extraAllowedContent: "*{*}",
					allowedContent: true,
					extraPlugins: ["font", "mentions"],
					toolbar: [
						{ name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
						{ name: "paragraph", items: ["NumberedList", "BulletedList"] },
						{ name: "insert", items: ["tag_list", "UserSearch"] },
					],
				}}
				name="ck_editor_name"
				onChange={handleEditorChange}
				initData="<p>This is an example CKEditor 4</p>"
				onPluginsLoaded={(args) => {
					const editor = args.editor;

					addRichCombo(editor, "tag_list", "Tag list", "Tag list", function () {
						Object.entries(tempPHIndv).forEach((entry) => {
							const [key, value] = entry;
							this.startGroup(key);
							Object.entries(value).forEach((entryInner) => {
								const [key, value] = entryInner;
								this.add("{{" + key + "}}", value);
							});
						});
					});
				}}
			/>

			<h3>Editor Content</h3>
			<div dangerouslySetInnerHTML={{ __html: viewData }} />
		</div>
	);
};

export default CkeditorComponent;
