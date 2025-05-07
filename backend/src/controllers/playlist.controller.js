import { db } from '../libs/db.js';

export const createPlaylist = async (req, res) => {
  const { name, description } = req.body;

  const userId = req.user.id;

  try {
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId
      }
    });
    res.status(201).json({ success: true, message: 'Playlist created successfully', playlist });
  } catch (error) {
    console.log('Error while creating playlist', error);
    res.status(500).json({ success: false, error: 'Error while creating playlist' });
  }
};

export const getAllListDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId
      },
      include: {
        problems: {
          include: {
            problem: true
          }
        }
      }
    });
    res.status(200).json({ success: true, message: 'Playlists fetched successfully', playlists });
  } catch (error) {
    console.log('Error while fetching playlist', error);
    res.status(500).json({ success: false, error: 'Error while fetching playlist' });
  }
};

export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id
      },
      include: {
        problems: {
          include: {
            problem: true
          }
        }
      }
    });

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    res.status(200).json({ success: true, message: 'Playlist details fetched successfully', playlist });
  } catch (error) {
    console.log('Error while fetching playlist details', error);
    res.status(500).json({ success: false, error: 'Error while fetching playlist details' });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or missing problem ids' });
    }

    //create records for each problem in the playlist
    const problemInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playListId: playlistId,
        problemId
      }))
    });

    if (!problemInPlaylist) {
      return res.status(500).json({ success: false, error: 'Error while adding problem to playlist' });
    }

    res.status(200).json({ success: true, message: 'Problems added to playlist successfully' });
  } catch (error) {
    console.log('Error while adding problem to playlist', error);
    res.status(500).json({ success: false, error: 'Error while adding problem to playlist' });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or missing problem ids' });
    }

    //delete records for each problem in the playlist
    const deleteProblemInPlaylist = await db.problemInPlaylist.deleteMany({
      where: {
        playListId:playlistId,
        problemId: { in: problemIds }
      }
    });

    if (!deleteProblemInPlaylist) {
      return res
        .status(500)
        .json({ success: false, error: 'Error while removing problem from playlist' });
    }

    res.status(200).json({ success: true, message: 'Problems removed from playlist successfully' });
  } catch (error) {
    console.log('Error while removing problem from playlist', error);
    res.status(500).json({ success: false, error: 'Error while removing problem from playlist' });
  }
};

export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const deletePlaylist = await db.playlist.delete({
      where: { id: playlistId }
    });

    if (!deletePlaylist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    console.log('Error while deleting playlist', error);
    res.status(500).json({ success: false, error: 'Error while deleting playlist' });
  }
};
