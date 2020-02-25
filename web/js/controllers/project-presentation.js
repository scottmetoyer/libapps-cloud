(function () {
    // ===============================================================================
    // Controllers / Project Presentation
    //

    function ProjectPresentationCtrl($state, $scope, $filter, bl, data) {
        var self = this;
        self.projects = [];

        $scope.initCarousel = function () {
            $(".owl-carousel").owlCarousel({
                loop: false,
                margin: 20,
                center: true,
                nav: true,
                items: 1
            });
        };

        self.loadProjects = function () {
            data.getProjects()
                .then(function (response) {
                    var items = response.data.Items;

                    // Filter the list based on route
                    self.projects = items.filter(function (project) {
                        return (project.executionStatus == 'in-flight');
                    });

                    self.projects.forEach(function (project) {
                        project.statusClass = bl.getStatusClass(project.status);

                        data.getStatusUpdates(project.id)
                            .then(function (res) {
                                var list = res.data.Items;

                                if (list.length > 0) {
                                    list = $filter('orderBy')(list, "timestamp", true);
                                    project.latestUpdate = list[0];
                                }
                            }, function (err) {
                                // Error loading status updates for this project
                                console.log(err);
                            });
                    })
                }).catch(function (err) {
                    console.log(err)
                });
        };

        self.loadProjects();
    }

    angular.module('pixeladmin')
        .controller('ProjectPresentationCtrl', ProjectPresentationCtrl);
})();