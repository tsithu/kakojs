/* eslint-disable no-tabs */
exports.up = async knex => knex.schema.raw(`
  CREATE OR REPLACE FUNCTION set_current_timestamp_on_update() RETURNS TRIGGER
  LANGUAGE 'plpgsql'
  AS
  $$
  BEGIN
    IF (NEW != OLD) THEN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END IF;
    RETURN OLD;
  END;
  $$;
`)

exports.down = async knex => {
  knex.schema.raw('DROP FUNCTION set_current_timestamp_on_update() CASCADE')
}
