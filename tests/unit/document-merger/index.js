'use strict';

const assert = require('assert');
const chai = require('chai');
const DocumentMerger = require('../../../src/document-merger.js');
const merger = new DocumentMerger();
const minify = require('html-minifier').minify;
const htmlDocuments = require('../../data/documents/html');

describe('DocumentMerger', () => {
    describe('#merge()', () => {
        it('should merge html', testMergeHTML);
        it('should merge html documents', testMergeHTMLDocuments);
        it('should merge html documents with glue', testMergeHTMLDocumentsWithGlue);
        it('should throw exception if no document type is given', testMergeDocumentsTypeException);
        it('should throw exception if no document content is given', testMergeDocumentsNoContentException);
    });
});

function testMergeHTML() {
  let options = {
    documents: [
      {
        content: '<h1>Hello</h1>',
        type: 'html'
      },
      {
        content: '<h2>World</h2>',
        type: 'html'
      }
    ]
  };

  assert.equal(merger.merge(options), minify(`
        <!doctype html>
        <html>
            <body>
                <h1>Hello</h1>
                <div class="pagebreak"></div>
                <h2>World</h2>
            </body>
        </html>
    `, {
    collapseWhitespace: true
  }));
}

function testMergeHTMLDocuments () {
    let options = {
        documents: htmlDocuments
    };

    assert.equal(merger.merge(options), minify(`
        <!doctype html>
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
        documents: htmlDocuments,
        glue: '<p>Custom glue</p>'
    };

    assert.equal(merger.merge(options), minify(`
        <!doctype html>
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

function testMergeDocumentsTypeException () {
    let options = {
        documents: [
            {
                content: `<html></html>`
            }
        ]
    };

    chai.expect(() => merger.merge(options)).to.throw('options.documents[0].type should be set');
}

function testMergeDocumentsNoContentException () {
    let options = {
        documents: [
            {
                content: null,
                type: 'html'
            }
        ]
    };

    chai.expect(() => merger.merge(options)).to.throw('options.documents[0].content should be set');
}
