import { Router } from "express";
import passport from "passport";
const router = Router();

router.get('/github', passport.authenticate('github', {scope: ['user:email']} ), async(req, res) => {

});
router.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'} ), async(req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json({ user: req.user });
});
export default router;