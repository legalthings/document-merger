'use strict';

const assert = require('assert');
const DocumentMerger = require('../../src/document-merger.js');
const merger = new DocumentMerger();
const minify = require('html-minifier').minify;

describe('DocumentMerger', function () {
    describe('#merge()', function () {
        it('should merge html documents', testMergeHTMLDocuments);
        it('should merge html documents with glue', testMergeHTMLDocumentsWithGlue);
    });
});

function testMergeHTMLDocuments () {
    // @todo: might want to write content on a single line if this file gets too big
    let options = {
        documents: [
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
        ]
    };

    assert.equal(merger.merge(options), minify(`
        <html>
          <head>
            <base href="http://example.com/cdn">
          </head>
          <body>
            <p>This is the first document</p>
            <div class="pagebreak"></div>
            <p>This is the second document</p>
            <b>It ends here</b>
          </body>
        </html>
    `, {
        collapseWhitespace: true
    }));
}

function testMergeHTMLDocumentsWithGlue () {
    let options = {
        documents: [
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
        ],
        glue: '<p>Custom glue</p>'
    };

    assert.equal(merger.merge(options), minify(`
        <html>
          <head>
            <base href="http://example.com/cdn">
          </head>
          <body>
            <p>This is the first document</p>
            <p>Custom glue</p>
            <p>This is the second document</p>
            <b>It ends here</b>
          </body>
        </html>
    `, {
        collapseWhitespace: true
    }));
}
