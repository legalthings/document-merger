'use strict';

const assert = require('assert');
const DocumentMerger = require('../../../src/document-merger.js');
const merger = new DocumentMerger();
const minify = require('html-minifier').minify;
const htmlDocuments = require('../../data/documents/html');

describe('DocumentMerger', function () {
    describe('#merge()', function () {
        it('should merge html documents', testMergeHTMLDocuments);
        it('should merge html documents with glue', testMergeHTMLDocumentsWithGlue);
    });
});

function testMergeHTMLDocuments () {
    let options = {
        documents: [ ...htmlDocuments ]
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
        documents: [ ...htmlDocuments ],
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
