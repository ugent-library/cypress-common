Cypress.Commands.add('getQueryParameter', { prevSubject: 'optional' }, (subject, name, _default = null) => {
    let subj = null;
    let url = null;

    if (Cypress._.isNil(subject)) {
        subj = cy.location('search', { log: false });
    } else if (Cypress._.isObject(subject) && subject.hasOwnProperty('toString')) {
        subj = cy.wrap(subject.toString(), { log: false });
    } else if (Cypress._.isString(subject)) {
        subj = cy.wrap(subject, { log: false });
    } else {
        throw new Error(`Cannot get query parameter for ${subject}`);
    }

    return subj
        .then((search) => {
            url = search;

            let hashes = search.slice(search.indexOf('?') + 1).split('&');
            return hashes.reduce((params, hash) => {
                let [key, val] = hash.split('=');
                return Object.assign(params, { [key]: decodeURIComponent(val) });
            }, {});
        })
        .then(function (query) {
            let result = _default;
            let message = [name];

            if (name in query) {
                result = query[name];
                message.push(result);
            } else {
                message.push(result);
                message.push('(default)');
            }

            Cypress.log({
                name: 'getQueryParameter',
                message: message,
                consoleProps: () => {
                    return {
                        'subject': url,
                        'name': name,
                        'result': result,
                        'default': _default,
                    };
                },
            });

            return result;
        });
});
