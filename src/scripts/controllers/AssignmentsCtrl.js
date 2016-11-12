app.controller("AssignmentsCtrl", ["$scope", function($scope){
  $scope.assignments = [
    {
      title: "Basic Japanese - Quiz 4/8",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus!",
      due: "29.11.2016 18:30",
      completed: false,
      grade: ""
    },
    {
      title: "Basic Japanese - Quiz 3/8",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus!",
      due: "22.11.2016 18:30",
      completed: true,
      grade: "A"
    },
    {
      title: "Basic Japanese - Quiz 2/8",
      description: "Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. ",
      due: "15.11.2016 18:30",
      completed: true,
      grade: "S"
    },
    {
      title: "Basic Japanese - Quiz 1/8",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      due: "15.11.2016 18:30",
      completed: true,
      grade: "S"
    },
    {
      title: "Listening comprehension 1/2",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus!",
      due: "7.11.2016 18:30",
      completed: true,
      grade: "C"
    }
  ];
}]);
