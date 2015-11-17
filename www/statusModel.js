var StatusModel = function(clients) {
    var self = this;
    self.clients = ko.observableArray();

    self.addClient = function(client) {
        self.clients.push(
            new ClientModel(client)
        );
    };
 
    self.removeClient = function(client) {
        self.clients.remove(client);
    };
 
    self.updateClient = function(person) 
    {
        for(var i = 0 ; i < self.clients().length ; i++)
        {
            var koObj = self.clients()[i];
            //console.log( koObj.name() )
            if(self.clients()[i].name() === person.name)
            {
                koObj.highestUploads(person.highestUploads);
                koObj.numberOfUploads(person.numberOfUploads);
                koObj.nodes([]);
                for( var j = 0; j < person.nodes.length ; j++ )
                {
                    koObj.nodes.push( new NodeModel(person.nodes[j]) );
                }
                break;
            }
        }
    };

    // initialize first time.
    for( var i = 0; i < clients.length; i++)
    {
        self.addClient( clients[i] );
    }
};

var ClientModel = function(client)
{
    var self = this;
    self.highestUploads = ko.observable(client.highestUploads);
    self.numberOfUploads = ko.observable(client.numberOfUploads);
    self.name = ko.observable(client.name);
    self.nodes = ko.observableArray([]);

    // init
    for( var i = 0; i < client.nodes.length; i++ )
    {
        self.nodes.push( new NodeModel(client.nodes[i]) );
    }
}

var NodeModel = function(node) {
    var self = this;
    self.color = ko.observable(node.color);
};

 
var viewModel = new StatusModel(
[
    { 
        name: "Fake Client", highestUploads: "39.95", numberOfUploads: "40"
    },
    { 
        name: "Your Computer", highestUploads: "0.00", numberOfUploads: "0"
    }
]);


$(document).ready( function()
{
    ko.applyBindings(viewModel);
    $('#statusTable').DataTable( { "paging":   false, "info":     false });

    var socket = io.connect('http://localhost:4005');

    socket.on("heartbeat", function(client) 
    {
        console.log(JSON.stringify(client));
        viewModel.updateClient( 
        {
            name:client.name, 
            highestUploads:client.highestUploads, 
            numberOfUploads: client.numberOfUpload
        });
    });
}); 
