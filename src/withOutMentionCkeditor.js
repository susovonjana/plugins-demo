// CkeditorComponent.js
import React, { useState } from "react";
import { CKEditor } from "ckeditor4-react";

const CkeditorComponent1 = () => {
	const [data, setData] = useState("");

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

	let place_holder_data = {};
	for (let category in tempPHIndv) {
		for (let key in tempPHIndv[category]) {
			place_holder_data[key] = tempPHIndv[category][key];
		}
	}

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

	// function dataFeed(opts, callback) {
	// 	var matchProperty = "value",
	// 		data = tempPHIndv?.filter(function (item) {
	// 			return item[matchProperty].indexOf(opts.query.toLowerCase()) == 0;
	// 		});

	// 	data = data.sort(function (a, b) {
	// 		return a[matchProperty].localeCompare(b[matchProperty], undefined, {
	// 			sensitivity: "accent",
	// 		});
	// 	});

	// 	callback(data);
	// }

	return (
		<div>
			<h2>CKEditor 4 in React</h2>
			{/* <CKEditor data={data} onChange={handleEditorChange} /> */}
			<CKEditor
				config={{
					extraAllowedContent: "*{*}",
					allowedContent: true,
					// removeButtons: "Image Flash Table",
					// contentsLangDirection: "rtl",
					extraPlugins: ["font", "autocomplete", "textmatch", "mentions"],
					toolbar: [
						{ name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
						{ name: "paragraph", items: ["NumberedList", "BulletedList"] },
						{ name: "insert", items: ["tag_list", "file_list", "support_doc"] },
					],
				}}
				name="ck_editor_name"
				onChange={handleEditorChange}
				initData="<p>This is an example CKEditor 4 WYSIWYG editor instance.</p>"
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
					addRichCombo(editor, "file_list", "File list", "File list", function () {
						Object.entries(tempPHIndv).forEach((entry) => {
							const [key, value] = entry;
							this.startGroup(key);
							Object.entries(value).forEach((entryInner) => {
								const [key, value] = entryInner;
								this.add("{{" + key + "}}", value);
							});
						});
					});
					addRichCombo(editor, "support_doc", "Supporting doc", "Supporting doc", function () {
						Object.entries(tempPHIndv).forEach((entry) => {
							const [key, value] = entry;
							this.startGroup(key);
							Object.entries(value).forEach((entryInner) => {
								const [key, value] = entryInner;
								this.add("{{" + key + "}}", value);
							});
						});
					});
					editor.on("blur", function () {
						let data = editor.getData();

						// Replace each placeholder with its value
						for (let placeholder in place_holder_data) {
							let value = place_holder_data[placeholder];
							data = data.replace(`{{${placeholder}}}`, value);
						}
						editor.setData(data);
					});
					// you want to replace only the values that are present in the editor, you can use the following code:
					// also for jump editor
					editor.on("focus", function () {
						let data = editor.getData();
						let shouldReplace = Object.values(place_holder_data).some((value) => data.includes(value));
						if (shouldReplace) {
							for (let placeholder in place_holder_data) {
								let value = place_holder_data[placeholder];
								data = data.replace(value, `{{${placeholder}}}`);
							}
							editor.setData(data);
						}
					});
				}}
			/>
			<h3>Editor Content</h3>
			<div dangerouslySetInnerHTML={{ __html: data }} />
		</div>
	);
};

export default CkeditorComponent1;
