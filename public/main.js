const formToggle = $(".form-open");
const taskToggleDiv = $(".task");
const taskToggleCheck = $(".completed");

$(formToggle).click(function() {
    $("#input-form").toggleClass("hidden");
});

$(taskToggleCheck).click(function () {
    $(this).parent().toggleClass("task-completed");
});