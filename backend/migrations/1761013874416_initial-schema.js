
exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createType('transaction_type', ['income', 'expense']);

  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('categories', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    type: { type: 'transaction_type', notNull: true },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.createTable('transactions', {
    id: 'id',
    description: { type: 'varchar(255)', notNull: true },
    amount: { type: 'decimal(10, 2)', notNull: true },
    date: { type: 'date', notNull: true },
    type: { type: 'transaction_type', notNull: true },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'integer',
      // Alterado para permitir nulo, caso uma categoria seja deletada
      notNull: false,
      references: '"categories"(id)',
      // Se a categoria for deletada, o campo fica nulo na transação.
      onDelete: 'SET NULL',
    },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable('transactions');
  pgm.dropTable('categories');
  pgm.dropTable('users');
  pgm.dropType('transaction_type');
};

