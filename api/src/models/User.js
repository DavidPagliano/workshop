const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'staff_registracion', 'staff_bedele', 'director'],
      default: 'staff_registracion',
    },
    activo: { type: Boolean, default: true },
    // Se incrementa al resetear la contraseña para invalidar los JWT ya emitidos.
    tokenVersion: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'creado', updatedAt: 'actualizado' },
    versionKey: false,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Nunca serializar el hash de la contraseña.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);