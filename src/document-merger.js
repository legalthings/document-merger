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
     * @param {object} options Mapping: {
                                 documents: [{content: String, type: String} ...],
                                 glue: String,
                                 head: String
                               }
     * @param {string}
     */
    merge (options) {
        if (!options.documents && !options.documents instanceof Array) {
            throw new TypeError('options.documents should be set and must be an array');
        }

        const documents = options.documents;
        const glue = options.glue || '<div style="page-break-after: always"><span style="display:none">&#xA0;</span></div>'; // pagebreak must not be empty
        const template = `<!doctype html><html><body></body></html>`;
        const $result = cheerio.load(template);

        for (let i = 0; i < documents.length; i++) {
            if (!documents[i].content) {
                throw new TypeError(`options.documents[${i}].content should be set`);
            }

            if (!documents[i].type) {
                throw new TypeError(`options.documents[${i}].type should be set`);
            }

            const type = documents[i].type;
            this[camelCase(`append_${type}_body`)](documents[i], $result, options);

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
     * @param {object} options
     */
    appendHtmlBody (doc, $result, options) {
        const $document = cheerio.load(doc.content);

        if (!$result('head').length && $document('head').length) {
            const head = options.head || '';
            $result('html').prepend('<head>' + $document('head').html() + head + '</head>');
        }

        if ($document('body').length) {
            $result('body').append($document('body').html());
        } else {
            $result('body').append($document.html());
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
