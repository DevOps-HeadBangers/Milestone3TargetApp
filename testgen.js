// code to generate test cases

var ListIterator = require('list-iterator');
var esprima = require("esprima");
var options = {
    tokens: true,
    tolerant: true,
    loc: true,
    range: true
};
var fs = require("fs");

function main() {
    var args = process.argv.slice(2);

    if (args.length == 0) {
        args = ["server.js"];
    }
    var filePath = args[0];

    constraints(filePath);

    // generateTestCases();

}

var callback = function(err, res) {
    t.same(res.status, 200, 'Test complete');
    t.end();
}

var content = '';

function generateAPITestCases(funcName, params) {

    // for (var i = 0; i < params.length; i++) {
    //     var param = params[i];
    //     if (funcName === 'get') {
    //         content = content + "\ntest('File upload test cases', function(t) { request(app).{0}('{1}').expect(200).end({2});});".format(funcName, param, callback);
    //     }
    // }

    if (funcName === 'get') {
        content = content + "\ntest('File upload test cases', function(t) { request(app).{0}('{1}').expect(200).end({2});});".format(funcName, params, callback);
    } else if (funcName === 'post') {
        content = content + "\ntest('File upload test cases', function(t) { request(app).{0}('{1}').expect(200).end({2});});".format(funcName, params, callback);
    }

    fs.appendFile('test.js', content, function(err) {
        if (err) throw err;

    });


}


function constraints(filePath) {
    var buf = fs.readFileSync(filePath, "utf8");
    var result = esprima.parse(buf, options);


    traverse(result, function(node) {
        if (node.type === 'CallExpression') {

            // Check for expressions using argument.
            traverse(node, function(child) {

                var params = '';

                if (child.type == "CallExpression" &&
                    child.callee.property &&
                    child.callee.property.name == "get") {

                    var funcName = child.callee.property.name;

                    // var params = [];

                    // params.push(child.arguments[0].value);
                    // params.push('/auth/photos');

                    params = child.arguments[0].value;

                    generateAPITestCases(funcName, params);

                    generateAPITestCases('post', params);

                }



            });
        }
    });
}

function traverse(object, visitor) {
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor) {
    var key, child;

    if (visitor.call(null, object)) {
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    traverseWithCancel(child, visitor);
                }
            }
        }
    }
}



if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

main();