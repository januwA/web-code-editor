## web-code-editor

Code editor on the browser, use [File System Access](https://wicg.github.io/file-system-access/) API


## install
```
$ npm i web-code-editor
```

## example
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

See also:
 - [codemirror.net](https://codemirror.net/index.html)
 - [codemirror cdn](https://cdnjs.com/libraries/codemirror)