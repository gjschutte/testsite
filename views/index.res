<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Title</title>
        <% include partials/header %>
    </head>

    <body>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-2">
                    <!-- block menu -->
                    <% include partials/menu.ejs %>
                </div>
                <div class="col-sm-10">

                    <h1><%= title %></h1>
                    <p>Welcome to <%=title %>, a very basic website to test node.js.</p>

                    <h1>Dynamic content</h1>
<!--                        <% tasks.forEach( function( task ){ %>
                            <p><%=task.description %></p>
                        <% }); %>
                    <ul>
                        <li>
                            <b>Tasks: </b> <%=data.task_count %>
                        </li>
                        <li>
                            <b>Categories: </b> <%=data.category_count %>
                        </li>
                        <li>
                            <b>Statusses: </b> <%=data.status_count %>
                        </li>
                    </ul> -->
                </div>
            </div>
        </div>
    </body>    
</html>