import { textTemplating } from "./app/textTemplating"

export const config = {
    license: "driver_license",
    character: "person",
    club: "get_fit_later_member",
    eventLog: "facebook_event_checkin",
    interview: "interview",
    clubCheckIn: "get_fit_later_check_in",
    scenario: "crime_scene_report",
    ranking: "income",
    solution: "solution",
    generation: 10000
}

console.log(textTemplating(__dirname + "/../conf/templates/template_sample.json"))