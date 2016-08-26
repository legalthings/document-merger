'use strict';

const html = [
    {
        content: `
            <html>
              <head>
                <base href="http://example.com/cdn">
              </head>
              <body>
                <p>This is the first document</p>
              </body>
            </html>
        `,
        type: 'html'
    },
    {
        content: `
            <html>
              <head>This should be ignored</head>
              <body>
                <p>This is the second document</p>
                <b>It ends here</b>
              </body>
            </html>
        `,
        type: 'html'
    }
];

module.exports = html;
