
# chat

## Configuration

Chat server looks for a configuration file `config.yaml` with following configuration options:

* `server.port`: Port number which server should listen to.
* `database.filename`: Path to the SQLite database file. Besides absolute or relative path, two special values are supported: `:memory:` for an in-memory database and empty string for temporary anonymous disk-based database.

See `config.yaml.example` for an example and default values.
