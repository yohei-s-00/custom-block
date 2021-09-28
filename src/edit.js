/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import { TextControl,Placeholder } from '@wordpress/components';
import { useState, useEffect } from 'react'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { youtubeId, apiKey, live } = attributes
	const [ isLive, setIsLive ] = useState(false)
	function onChengeId(newId){
		setAttributes({ youtubeId: newId })
	}
	function onChengeKey(newkey){
		setAttributes({ apiKey: newkey })
	}
	useEffect(()=>{
		async function getLive(){
			const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${apiKey}&fields=items(id,snippet(title,liveBroadcastContent))&part=snippet`)
			const res = await response.json()
			console.log(res.items[0].snippet.liveBroadcastContent)
			if(res.items[0].snippet.liveBroadcastContent == "live"){
				setIsLive(true)
				console.log(isLive);
				setAttributes({ live: true })
			}else{
				setIsLive(false)
				setAttributes({ live: false })
			}
		}
		getLive()
	},[attributes])
	return (
		<div { ...useBlockProps() }>
			<Placeholder
				label={__( 'Gutenpride Block', 'gutenpride' )}
				instructions={__( 'Add your message', 'gutenpride' )}
			>
				<TextControl
					value={ youtubeId }
					label={ __( 'youtubeId', 'gutenpride' )}
					type="text"
					onChange={onChengeId}
				/>
				<TextControl
					value={ apiKey }
					label={ __( 'api-key', 'gutenpride' )}
					type="text"
					onChange={onChengeKey}
				/>
			</Placeholder>
			<p>{isLive? "ライブ" : "準備中"}</p>
		</div>
	);
}
