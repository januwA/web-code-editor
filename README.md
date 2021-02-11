## web-code-editor

Code editor on the browser, use [File System Access](https://wicg.github.io/file-system-access/) API

[codemirror demo](https://januwa.github.io/web-code-editor/index.html) and [monaco demo](https://januwa.github.io/web-code-editor/monaco.html)

## install
```
$ npm i web-code-editor
```

## codemirror example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html,
      body {
        position: relative;
        padding: 0;
        margin: 0;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }
    </style>
    
    <!-- The editor uses codemirror, so you need to import codemirror, you can choose different styles -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/codemirror.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/theme/dracula.min.css"
    />

    <!-- import web-code-editor.css-->
    <link href="./node_modules/web-code-editor/dist/web-code-editor.css" rel="stylesheet" />
  </head>
  <body>

    <!-- import web-code-editor.js-->
    <script src="./node_modules/web-code-editor/dist/web-code-editor.js"></script>

    <!-- import codemirror.js-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/mode/javascript/javascript.min.js"></script>
    <script>

      // Initialize the Web Code Editor
      new WebCodeEditor.WebCodeEditor(
        document.body,
        (place) => {
          // You must return a CodeMirror object
          return CodeMirror(place, {
            lineNumbers: true,
            theme: "dracula",
          });
        },
        {
          // You can replace these static text
          staticText: {
            openFolder: "Open Folder",
            selectFolder: "Select Folder",
            close: "Close",
            closeAll: "Close All",
            closeOther: "Close Other",
            closeRight: "Close Right",
            openRight: "Open Right",
            delete: "delete",
            newFile: "new File",
            newDir: "new Dir",
            errMeg: "File or file name must be provided",
            save: "Save",
          },
        }
      );
    </script>
  </body>
</html>
```

## monaco example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title><%= htmlWebpackPlugin.options.title %></title>

    <style>
      html,
      body {
        position: relative;
        padding: 0;
        margin: 0;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }
    </style>

    <link
      rel="stylesheet"
      data-name="vs/editor/editor.main"
      href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.22.3/min/vs/editor/editor.main.min.css"
    />

    <!-- import web-code-editor.css-->
    <link href="./node_modules/web-code-editor/dist/web-code-editor.css" rel="stylesheet" />
  </head>

  <body>
    <!-- import web-code-editor.js-->
    <script src="./node_modules/web-code-editor/dist/web-code-editor.js"></script>

    <script>
      var require = {
        paths: {
          vs:
            "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.22.3/min/vs",
        },
        "vs/nls": { availableLanguages: { "*": "zh-cn" } },
      };
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.22.3/min/vs/loader.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.22.3/min/vs/editor/editor.main.nls.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.22.3/min/vs/editor/editor.main.nls.zh-cn.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.22.3/min/vs/editor/editor.main.js"></script>

    <script>
      // monaco.editor.setModelLanguage(editor.getModel(), lang);
      var editor;
      new WebCodeEditor.WebCodeEditor(
        document.body,
        (place) => {
          editor = monaco.editor.create(place, {
            language: "javascript",
            theme: "vs-dark",
            automaticLayout: true,
          });
          return editor;
        },
        {
          languageMap: {
            md: "markdown",
            ts: "typescript",
            js: "javascript",
            pl: "perl",
            kt: "kotlin",
          },
        }
      );
    </script>
  </body>
</html>

```

See also:
 - [codemirror.net](https://codemirror.net/index.html)
 - [codemirror cdn](https://cdnjs.com/libraries/codemirror)
 - [monaco-editor](https://www.npmjs.com/package/monaco-editor)