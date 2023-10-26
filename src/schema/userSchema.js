const mongoose = require("mongoose");

const data = require("./dataSchema");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: {default: false, type: Boolean},
    data : 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: data,
      },
    


  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
    const user = this;
  
    if (!user.isModified("password")) {
      return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, async function (err, hash) {
        if (err) return next(err);
  
        user.password = hash;
        next();
      });
    });
  });

module.exports = mongoose.model("User", userSchema);
