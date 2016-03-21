// LICENSE : MIT
"use strict";
import {Attachment} from "jsdoc-to-assert"
export default function ({template}) {
    return {
        visitor: {
            FunctionDeclaration(path) {
                const node = path.node;
                if (node.leadingComments && node.leadingComments.length === 1) {
                    const comment = node.leadingComments[0];
                    if (comment.type === 'CommentBlock') {
                        const functionDeclarationString = Attachment.FunctionDeclarationString(comment);
                        const buildAssert = template(functionDeclarationString)();
                        path.get("body").unshiftContainer("body", buildAssert);
                    }
                }
            }
        }
    };
}