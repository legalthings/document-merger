'use strict'

const cheerio = require('cheerio');
const minify = require('html-minifier').minify;
const camelCase = require('camelcase');

class DocumentMerger {
    constructor() {
    }

    /**
     * Merge documents of any type
     *
     * @public
     * @param {object} options Mapping: { documents: [{content: String, type: String} ...], glue: String }
     * @param {string}
     */
    merge (options) {
        if (!options.documents && !options.documents instanceof Array) {
            throw new TypeError('options.documents should be set and must be an array');
        }

        let documents = options.documents;
        let glue = options.glue || '<div class="pagebreak"></div>';
        let $result = cheerio.load('<html><body></body></html>');

        for (let i = 0; i < documents.length; i++) {
            if (!documents[i].content) {
                throw new TypeError(`options.documents[${i}].content should be set`);
            }

            if (!documents[i].type) {
                throw new TypeError(`options.documents[${i}].type should be set`);
            }

            let type = documents[i].type;
            this[camelCase(`append_${type}_body`)](documents[i], $result);

            if (i < documents.length - 1) {
                $result('body').append(glue);
            }
        }

        return minify($result.html(), {
            collapseWhitespace: true
        });
    }

    /**
     * Appends the body of a html document to the result body
     *
     * @protected
     * @param {object} doc
     * @param {object} $result
     */
    appendHtmlBody (doc, $result) {
        let $document = cheerio.load(doc.content);

        if (!$result('head').length && $document('head').length) {
            $result('html').prepend('<head>' + $document('head').html() + '</head>');
        }

        if ($document('body').length) {
            $result('body').append($document('body').html());
        }
    }

    /**
     * Appends a pdf document document to the result body
     *
     * @protected
     * @param {object} doc
     * @param {object} $result
     */
    appendPdfBody (doc, $result) {
        // @todo: Convert pdf to html and then append it to result
    }

    /**
     * Appends a docx document document to the result body
     *
     * @protected
     * @param {object} doc
     * @param {object} $result
     */
    appendDocxBody (doc, $result) {
        // @todo: Convert docx to html and then append it to result
    }
}

module.exports = DocumentMerger;
