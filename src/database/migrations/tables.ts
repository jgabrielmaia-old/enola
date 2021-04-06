import Knex from "knex";
import { config } from '../../app'

export async function up(knex: Knex) {
  return knex.schema
    .createTable(config.license, createLicense)
    .createTable(config.character, createCharacter)
    .createTable(config.club, createClub)
    .createTable(config.eventLog, createEventLog)
    .createTable(config.interview, createInterview)
    .createTable(config.clubCheckIn, createClubCheckIn)
    .createTable(config.scenario, createScenario)
    .createTable(config.ranking, createRanking)
    .createTable(config.solution, createSolution);
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTable(config.solution)
    .dropTable(config.ranking)
    .dropTable(config.scenario)
    .dropTable(config.clubCheckIn)
    .dropTable(config.interview)
    .dropTable(config.eventLog)
    .dropTable(config.club)
    .dropTable(config.character)
    .dropTable(config.license);
}

function createLicense(table : any) {
  table.increments("id").primary();
  table.integer("age").notNullable();
  table.integer("height").notNullable();
  table.string("eye_color").notNullable();
  table.string("hair_color").notNullable();
  table.string("gender").notNullable();
  table.string("plate_number").notNullable();
  table.string("car_maker").notNullable();
  table.string("car_model").notNullable();
}

function createCharacter(table : any) {
  table.increments("id").primary();
  table.string("name").notNullable();
  table.integer("license_id").references("id").inTable(config.license);
  table.integer("address_number").notNullable();
  table.string("address_street_name").notNullable();
  table.integer("ssn").notNullable();
}

function createClub(table: any) {
  table.string("id").primary();
  table.integer("person_id").references("id").inTable(config.character);
  table.string("name").notNullable();
  table.string("membership_start_date").notNullable();
  table.string("membership_status").notNullable();
}

function createEventLog(table: any) {
  table.increments("id").primary();
  table.integer("person_id").references("id").inTable(config.character);
  table.string("event_name").notNullable();
  table.integer("date").notNullable();
}

function createInterview(table: any) {
  table.increments("id").primary();
  table.integer("person_id").references("id").inTable(config.character);
  table.string("transcript").notNullable();
}

function createClubCheckIn(table: any) {
  table.string("membership_id").primary();
  table.integer("check_in_date").notNullable();
  table.integer("check_in_time").notNullable();
  table.integer("check_out_time").notNullable();
}

function createScenario(table: any) {
  table.integer("date").primary();
  table.string("type").notNullable();
  table.string("description").notNullable();
  table.string("city").notNullable();
}

function createRanking(table: any) {
  table.integer("ssn").references("ssn").inTable(config.character);
  table.integer("annual_income").notNullable();
}

function createSolution(table: any) {
  table.integer("user").notNullable();
  table.string("value").notNullable();
}
