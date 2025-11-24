import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../configs/database';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string | null;
  declare status: TaskStatus;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title tidak boleh kosong' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
      allowNull: false,
      defaultValue: 'To Do',
      validate: {
        isIn: {
          args: [['To Do', 'In Progress', 'Done']],
          msg: "Status harus 'To Do', 'In Progress', atau 'Done'",
        },
      },
    },
    // secara umum timestamp di manage langsung oleh sequelize tapi disini tetap harus ditulis agar tidak type error dari typescript
    // hal ini juga sudah dijelaskan di dokumentasi resmi sequelize tentang typescript
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
  }
);

export default Task;
