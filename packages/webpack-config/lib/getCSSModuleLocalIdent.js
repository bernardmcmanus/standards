/**
 * @see https://github.com/facebook/create-react-app/blob/a351750bc94639d3636e4b9b219453b79a921cbf/packages/react-dev-utils/getCSSModuleLocalIdent.js
 *
 * MIT License
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function getLocalIdent(
	context,
	localIdentName,
	localName,
	options
) {
	// Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
	const fileNameOrFolder = context.resourcePath.match(
		/index\.module\.(css|scss|sass)$/
	)
		? '[folder]'
		: '[name]';
	// Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
	const hash = loaderUtils.getHashDigest(
		path.posix.relative(context.rootContext, context.resourcePath) + localName,
		'md5',
		'base64',
		5
	);
	// Use loaderUtils to find the file or folder name
	const className = loaderUtils.interpolateName(
		context,
		fileNameOrFolder + '_' + localName + '__' + hash,
		options
	);
	// remove the .module that appears in every classname when based on the file.
	return className.replace('.module_', '_');
};
