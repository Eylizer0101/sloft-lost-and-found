import User from '../../models/User.js'

export const updateUser = async (req, res) => {
  const { id } = req.params
  const newData = req.body

  try {
    // ✅ kung may inupload na image
    if (req.file) {
      newData.img = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` // absolute URL fix
    }

    // ✅ Make sure address is included if present
    if (newData.address !== undefined) {
      newData.address = newData.address
    }

    // Ensure we don't accidentally remove fields – use findOneAndUpdate as before
    const userUpdated = await User.findOneAndUpdate(
      { _id: id },
      newData,
      { new: true }
    )

    if (userUpdated) {
      return res.status(200).json({ ok: true, msg: 'User Updated!', userUpdated })
    }

    return res.status(200).json({
      ok: false,
      msg: "The user that you're trying to edit doesn't exist",
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      ok: false,
      msg: 'An error occurred, contact an administrator',
    })
  }
}

export default updateUser;
