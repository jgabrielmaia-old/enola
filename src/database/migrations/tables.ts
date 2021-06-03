import Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { load } from "../../app/state-management";

const config = load(__dirname + "/../../../conf/context.json")

export async function up(knex: Knex) {
  return knex.schema
    .createTable(schemaConfig.license, createTableLicense)
    .createTable(schemaConfig.character, createTableCharacter)
    .createTable(schemaConfig.clubMembership, createTableClub)
    .createTable(schemaConfig.eventLog, createTableEventLog)
    .createTable(schemaConfig.interview, createInterview)
    .createTable(schemaConfig.clubCheckin, createTableClubCheckin)
    .createTable(schemaConfig.scenario, createTableScenario)
    .createTable(schemaConfig.ranking, createTableRanking)
    .createTable(schemaConfig.solution, createTableSolution);
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTable(schemaConfig.solution)
    .dropTable(schemaConfig.ranking)
    .dropTable(schemaConfig.scenario)
    .dropTable(schemaConfig.clubCheckin)
    .dropTable(schemaConfig.interview)
    .dropTable(schemaConfig.eventLog)
    .dropTable(schemaConfig.clubMembership)
    .dropTable(schemaConfig.character)
    .dropTable(schemaConfig.license);
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
  table
    .integer(`${config.license}_id`)
    .references("id")
    .inTable(schemaConfig.license);
  table.integer("address_number").notNullable();
  table.string("address_street_name").notNullable();
  table.integer("ssn").notNullable();
}

function createTableClub(table: any) {
  table.increments("id").primary();
  table
    .integer(`${config.character}_id`)
    .references("id")
    .inTable(schemaConfig.character);
  table.integer("membership_start_date").notNullable();
  table.string("membership_status").notNullable();
}

function createTableEventLog(table: any) {
  table.increments("id").primary();
  table
    .integer(`${config.character}_id`)
    .references("id")
    .inTable(schemaConfig.character);
  table.string("event_name").notNullable();
  table.integer("event_date").notNullable();
}

function createInterview(table: any) {
  table.increments("id").primary();
  table
    .integer(`${config.character}_id`)
    .references("id")
    .inTable(schemaConfig.character);
  table.string("transcript").notNullable();
}

function createTableClubCheckin(table: any) {
  table.increments("id").primary();
  table
    .integer(`${config.clubMembership}_id`)
    .references("id")
    .inTable(schemaConfig.character);
  table.integer("check_in_date").notNullable();
  table.integer("check_in_time").notNullable();
  table.integer("check_out_time").notNullable();
}

function createTableScenario(table: any) {
  table.integer("id").primary();
  table.integer("date").notNullable();
  table.string("description").notNullable();
  table.string("city").notNullable();
}

function createTableRanking(table: any) {
  table.integer("ssn").references("ssn").inTable(schemaConfig.character);
  table.integer("annual_income").notNullable();
}

function createTableSolution(table: any) {
  table.integer("user").notNullable();
  table.string("value").notNullable();
}
