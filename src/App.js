// import "./App.css";
import CkeditorComponent from "./CkeditorComponent";
import QuillDemo from "./quillDemo";
import CkeditorComponent1 from "./withOutMentionCkeditor";
import QuillMentionExample from "./quillMentionExample";

import { SimpleEditor } from "./tiptop/TiptopEditor";
import "./tiptop/styles.css";

function App() {
	return (
		<div className="App">
			<h1>Plugins Demo</h1>
			{/* <CkeditorComponent /> */}
			{/* <CkeditorComponent1 /> */}
			{/* <QuillDemo /> */}
			{/* <QuillMentionExample /> */}
			{/* <input type="text" id="editor" /> */}
			<SimpleEditor />
		</div>
	);
}

export default App;
