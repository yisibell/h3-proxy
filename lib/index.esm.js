import isGlob from 'is-glob';
import micromatch from 'micromatch';
import url from 'node:url';

const isStringPath = (pathFilter) => {
    return typeof pathFilter === 'string' && !isGlob(pathFilter);
};
const isGlobPath = (pattern) => {
    return typeof pattern === 'string' && isGlob(pattern);
};
const isMultiPath = (pathFilter) => {
    return Array.isArray(pathFilter);
};
const matchSingleStringPath = (pathname, pathFilter) => {
    if (!pathFilter)
        return false;
    return pathname.indexOf(pathFilter) >= 0;
};
const matchMultiPath = (pathname, pathFilterList) => {
    return pathFilterList.some((pattern) => matchSingleStringPath(pathname, pattern));
};
const matchSingleGlobPath = (pathname, pattern) => {
    if (!pattern)
        return false;
    const matches = micromatch([pathname], pattern);
    return matches && matches.length > 0;
};
const matchMultiGlobPath = (pathname, patterns) => {
    return matchSingleGlobPath(pathname, patterns);
};
const isTargetFilterPath = (pathname = '', { pathFilter, req }) => {
    if (typeof pathFilter === 'function') {
        return pathFilter(pathname, req);
    }
    if (isGlobPath(pathFilter)) {
        return matchSingleGlobPath(pathname, pathFilter);
    }
    if (isStringPath(pathFilter)) {
        return matchSingleStringPath(pathname, pathFilter);
    }
    if (isMultiPath(pathFilter)) {
        if (pathFilter.every(isStringPath)) {
            return matchMultiPath(pathname, pathFilter);
        }
        if (pathFilter.every(isGlobPath)) {
            return matchMultiGlobPath(pathname, pathFilter);
        }
    }
    return false;
};

const createProxyEventHandler = (options) => {
    const { pathFilter } = options;
    return (event) => {
        const { req } = event.node;
        const path = url.parse(req.url || '').pathname || '';
        if (isTargetFilterPath(path, { pathFilter, req })) {
            console.log(path);
        }
    };
};

export { createProxyEventHandler };
