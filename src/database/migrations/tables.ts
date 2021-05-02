import Knex from "knex";
import { config } from '../../app'

export async function up(knex: Knex) {
  return knex.schema
    .createTable(config.license, createTableLicense)
    .createTable(config.character, createTableCharacter)
    .createTable(config.club, createTableClub)
    .createTable(config.eventLog, createTableEventLog)
    .createTable(config.interview, createInterview)
    .createTable(config.clubCheckin, createTableClubCheckin)
    .createTable(config.scenario, createTableScenario)
    .createTable(config.ranking, createTableRanking)
    .createTable(config.solution, createTableSolution);
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTable(config.solution)
    .dropTable(config.ranking)
    .dropTable(config.scenario)
    .dropTable(config.clubCheckin)
    .dropTable(config.interview)
    .dropTable(config.eventLog)
    .dropTable(config.club)
    .dropTable(config.character)
    .dropTable(config.license);
}

function createTableLicense(table: any) {
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

function createTableCharacter(table: any) {
  table.increments("id").primary();
  table.string("name").notNullable();
  table.integer(`${config.license}_id`).references("id").inTable(config.license);
  table.integer("address_number").notNullable();
  table.string("address_street_name").notNullable();
  table.integer("ssn").notNullable();
}

function createTableClub(table: any) {
  table.increments("id").primary();
  table.integer(`${config.character}_id`).references("id").inTable(config.character);
  table.string("name").notNullable();
  table.integer("membership_start_date").notNullable();
  table.string("membership_status").notNullable();
}

function createTableEventLog(table: any) {
  table.increments("id").primary();
  table.integer(`${config.character}_id`).references("id").inTable(config.character);
  table.string("event_name").notNullable();
  table.integer("event_date").notNullable();
}

function createInterview(table: any) {
  table.increments("id").primary();
  table.integer(`${config.character}_id`).references("id").inTable(config.character);
  table.string("transcript").notNullable();
}

function createTableClubCheckin(table: any) {
  table.integer(`${config.club}_id`).references("id").inTable(config.character).primary();
  table.integer("check_in_date").notNullable();
  table.integer("check_in_time").notNullable();
  table.integer("check_out_time").notNullable();
}

function createTableScenario(table: any) {
  table.integer("date").primary();
  table.string("description").notNullable();
  table.string("city").notNullable();
}

function createTableRanking(table: any) {
  table.integer("ssn").references("ssn").inTable(config.character);
  table.integer("annual_income").notNullable();
}

function createTableSolution(table: any) {
  table.integer("user").notNullable();
  table.string("value").notNullable();
}
